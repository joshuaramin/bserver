import { prisma } from "@/src/helper/prisma";
import express from "express";

type IdentityLayoutType = {
  where: {
    is_deleted: boolean;
    College?: {
      name: {
        contains: string;
        mode: "insensitive" | "default";
      };
    };
  };
  include?: {};
};

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page, name } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(page as string);
    const offset = (pageNum - 1) * limitNum;

    let whereArr: IdentityLayoutType = {
      where: {
        is_deleted: false,
      },
    };

    if (name) {
      whereArr.where.College = {
        name: {
          contains: name.toString(),
          mode: "insensitive",
        },
      };
    }

    let queryParams = {
      whereArr: whereArr.where,
      take: limitNum,
      skip: offset,
    };

    const totalItems = await prisma.identityLayout.count({
      where: whereArr.where,
    });

    const items = await prisma.identityLayout.findMany({
      where: {
        College: {},
      },
    });
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
  } catch (e) {
    console.log(e);
  }
});

router.post("/create", async (req, res, next) => {
  const { college_id } = req.body;

  const identity_layout = await prisma.identityLayout.create({
    data: {
      college_id,
    },
  });

  const result = {
    data: identity_layout,
    status: 2000,
  };

  res.json(result);
});

export default router;
