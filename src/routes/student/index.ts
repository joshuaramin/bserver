import { prisma } from "@/src/helper/prisma";
import express from "express";

const router = express.Router();

type StudentWhere = {
  where: {
    student_no?: {
      contains: string;
      mode: "insensitive" | "default";
    };
    is_deleted?: boolean;
  };
  include: {};
};

router.get("/", async (req, res, next) => {
  const { student_no } = req.query;

  let student;
  let result;

  let whereArr: StudentWhere = {
    where: {
      is_deleted: false,
    },
    include: {
      College: true,
    },
  };

  if (student_no) {
    whereArr.where = {
      student_no: {
        contains: student_no.toString(),
        mode: "insensitive",
      },
    };
  }

  let results = await prisma.student.findMany(whereArr);

  if (results.length === 1) {
    student = await prisma.student.findFirst(whereArr);
  }

  result = {
    data: student,
    status: 200,
    queryParams: whereArr,
  };

  res.json(result);
});

router.post("/create", async (req, res, next) => {
  const { student_no, college_id } = req.body;
  const student = await prisma.student.create({
    data: {
      student_no,
      college_id,
    },
  });

  const result = {
    data: student,
    status: 200,
  };
  res.json(result);
});
export default router;
