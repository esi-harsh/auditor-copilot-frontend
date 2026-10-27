import axios from "axios";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import mammoth from "mammoth";
import * as PDFJS from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import secureLocalStorage from "react-secure-storage";

// Set PDF worker
// Tell pdf.js where to find the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const baseUrl = import.meta.env.VITE_AI_PLAYGROUND_BASE_URL;
const API_KEY = import.meta.env.VITE_AI_PLAYGROUND_API_KEY;

export const AI_PLAYGROUND_WORKFLOWS = {
  EMBEDDING: { flowId: "c7f48ee6-fab9-4119-9670-0bb145da124e" },
  AGENT: { flowId: "b749c4bc-16f3-4749-a0fc-0395be267150" },
};

export const uploadFileAPI = async (file) => {
  try {
    // Get the flowId based on the flag
    const flow = AI_PLAYGROUND_WORKFLOWS["AGENT"];
    if (!flow) {
      throw new Error("Invalid flag provided");
    }

    console.log("uploading file api called");
    const formData = new FormData();
    formData.append("file", file);

    // Detect file type
    const fileType = file.name.split(".").pop().toLowerCase();

    let fileContent = "";

    // Read file content based on type
    if (fileType === "txt") {
      fileContent = await file.text();
    } else if (fileType === "csv") {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      fileContent = JSON.stringify(parsed.data);
    } else if (fileType === "xlsx") {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const allSheets = {};
      workbook.SheetNames.forEach((sheetName) => {
        allSheets[sheetName] = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName],
          { header: 1 }
        );
      });
      fileContent = JSON.stringify(allSheets);
    } else if (fileType === "docx" || fileType === "doc") {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      fileContent = value;
    } else if (fileType === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textContent = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map((item) => item.str).join(" ") + "\n";
      }
      fileContent = textContent;
    } else {
      console.warn("Unsupported file type:", fileType);
    }

    // Save file content securely
    secureLocalStorage.setItem(`FILE-DIRECTORY-${file.name}`, fileContent);

    // Update the list of stored file keys
    let keys = secureLocalStorage.getItem("FILE-DIRECTORY-KEYS") || [];
    if (!keys.includes(`FILE-DIRECTORY-${file.name}`)) {
      keys.push(`FILE-DIRECTORY-${file.name}`);
      secureLocalStorage.setItem("FILE-DIRECTORY-KEYS", keys);
    }

    const embeddingResponse = await fileIngestionAPI(response.data.file_path);
    console.log("Embedding response: ", embeddingResponse);
    return response.data;
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};

export const fileIngestionAPI = async (filePath) => {
  try {
    const flow = AI_PLAYGROUND_WORKFLOWS["EMBEDDING"];
    if (!flow) {
      throw new Error("Invalid flag provided");
    }

    const flowId = flow.flowId;

    const response = await axios.post(
      `${baseUrl}/api/v1/run/${flowId}?stream=false`,
      {
        output_type: "text",
        input_type: "text",
        tweaks: {
          "File-STjml": {
            concurrency_multithreading: 4,
            delete_server_file_after_processing: true,
            ignore_unspecified_files: false,
            ignore_unsupported_extensions: true,
            path: `${filePath}`,
            silent_errors: false,
            use_multithreading: false,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${API_KEY}`,
        },
      }
    );

    return `Embedding created successfully for file: ${filePath}`;
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};
