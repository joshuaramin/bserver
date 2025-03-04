import { prisma } from "@/src/helper/prisma";
import slugify from "@/src/helper/slugify";
import express from "express";

const router = express.Router();

type CollegeWhere = {
  where: {
    college_id?: string;
    name?: {
      contains: string;
      mode: "insensitive" | "default";
    };
    is_deleted?: boolean;
  };
  include?: {};
};

router.get("/", async (req, res, next) => {
  try {
    const { college_id, name, limit, page } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let whereArr: CollegeWhere = {
      where: {
        is_deleted: false,
      },
      include: {
        Media: true,
        IdentityLayout: true,
      },
    };

    if (college_id) {
      whereArr.where = {
        is_deleted: false,
        college_id: college_id.toString(),
      };
    }

    if (name) {
      whereArr.where = {
        name: {
          contains: name.toString(),
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

    const totalItems = await prisma.college.count({ where: whereArr.where });

    const items = await prisma.college.findMany(queryParams);
    const totalPages = Math.ceil(totalItems / parseInt(limit as string));

    const result = {
      data: {
        item: items,
        totalPages,
        totalItems,
        currentPages: pageNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      status: 200,
      queryParams: queryParams,
    };

    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

router.post("/create", async (req, res, next) => {
  const { name } = req.body;

  const college = await prisma.college.create({
    data: {
      name,
      slug: slugify(name),
    },
  });

  const result = {
    data: college,
    status: 200,
  };

  res.json(result);
});

export default router;
