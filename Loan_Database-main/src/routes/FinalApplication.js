import express from "express";

import {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  addDocuments,
  processApplication,
} from "../controllers/FinalApplication.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/create",
  createApplication
);

router.get(
  "/",
  getAllApplications
);

router.get(
  "/:id",
  getApplicationById
);

router.put(
  "/:id",
  updateApplication
);

router.post(
  "/:id/upload",
  upload.fields([
    {
      name: "aadhaarFile",
      maxCount: 1,
    },
    {
      name: "panFile",
      maxCount: 1,
    },
    {
      name: "payslipFile",
      maxCount: 1,
    },
    {
      name: "form16File",
      maxCount: 1,
    },
    {
      name: "bankStatementFile",
      maxCount: 1,
    },
  ]),
  addDocuments
);

router.post(
  "/:id/process",
  processApplication
);

export default router;