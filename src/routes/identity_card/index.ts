import { prisma } from "@/src/helper/prisma";
import express from "express";

type IdentityCardType = {
  where: {
    is_deleted: boolean;
    College: {
      name: {
        contains: string;
        mode: "insensitive" | "default";
      };
    };
  };
  include: {
    College?: {
      include: {
        Media: boolean;
      };
    };
  };
};

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page, name } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let whereArr: IdentityCardType = {
      where: {
        is_deleted: false,
        College: {
          name: {
            contains: name.toString(),
            mode: "insensitive",
          },
        },
      },
      include: {
        College: {
          include: {
            Media: true,
          },
        },
      },
    };

    if (name) {
      whereArr.where = {
        College: {
          name: {
            contains: name.toString(),
            mode: "insensitive",
          },
        },
        is_deleted: false,
      };
    }

    let queryParams = {
      where: whereArr.where,
      include: whereArr.include,
      take: limitNum,
      skip: offset,
    };

    const totalItems = await prisma.identityCard.count({
      where: whereArr.where,
    });
    const items = await prisma.identityCard.findMany(queryParams);
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

  const identity_card = await prisma.identityCard.create({
    data: {
      college_id,
    },
  });

  const result = {
    data: identity_card,
    status: 200,
  };

  res.json(result);
});

export default router;
