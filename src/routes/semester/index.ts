import { prisma } from "@/src/helper/prisma";
import express from "express";

type SemesterType = {
  is_deleted: boolean;
  name?: {
    contains: string;
    mode: "insensitive" | "default";
  };
  include?: {};
};

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page, name } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let whereArr: SemesterType = {
      is_deleted: false,
    };

    if (name) {
      whereArr.name = {
        contains: name.toString(),
        mode: "insensitive",
      };
    }

    let queryParams = {
      where: whereArr,
      take: limitNum,
      skip: offset,
    };

    const totalItems = await prisma.identityCard.count({
      where: whereArr,
    });

    const items = await prisma.semester.findMany(queryParams);
    const totalPages = Math.ceil(totalItems / parseInt(limit as string));

    const result = {
      data: {
        item: items,
        totalPages,
        totalItems,
        currentPages: page,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      status: 200,
      queryParams: queryParams,
    };

    res.json(result);
  } catch (e) {}
});

router.post("/create", async (req, res, next) => {
  const { name } = req.body;

  const semester = await prisma.semester.create({
    data: {
      name,
    },
  });

  const result = {
    data: semester,
    status: 200,
  };

  res.json(result);
});

export default router;
