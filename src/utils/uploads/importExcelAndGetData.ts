import xlsx from "xlsx";
import AppError from "../errors/appError";

export const importExcelAndGetData = async (file: Express.Multer.File) => {
  try {
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    return data;
  } catch (error: any) {
    throw new AppError(error.message, 500);
  }
};
