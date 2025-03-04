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
  try {
    const { student_no, limit, page } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

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

    let queryParams = {
      where: whereArr.where,
      include: whereArr.include,
      take: limitNum,
      skip: offset,
    };

    const totalItems = await prisma.student.count({ where: whereArr.where });
    const items = await prisma.student.findMany(queryParams);
    const totalPages = Math.ceil(totalItems / parseInt(limit as string));

    const result = {
      data: {
        item: items,
        totalPages,
        totalItems,
        currentPage: pageNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      status: 200,
      queryParams,
    };

    res.json(result);
  } catch (e) {
    console.log(e);
  }
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
