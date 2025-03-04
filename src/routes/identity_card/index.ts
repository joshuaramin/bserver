import { prisma } from "@/src/helper/prisma";
import express from "express";

type IdentityCardType = {
  where: {
    is_deleted: boolean;
    Student?: {
      student_no: {
        contains: string;
        mode: "insensitive" | "default";
      };
    };
  };
  include: {
    Semester?: boolean;
    Student?: {
      include: {
        College: true;
      };
    };
  };
};

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page, name } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    let whereArr: IdentityCardType = {
      where: {
        is_deleted: false,
      },
      include: {
        Semester: true,
        Student: {
          include: {
            College: true,
          },
        },
      },
    };

    if (name) {
      whereArr.where = {
        Student: {
          student_no: {
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
  const { student_no, semester_id } = req.body;

  const identity_card = await prisma.identityCard.create({
    data: {
      Semester: {
        connect: {
          semester_id,
        },
      },
      Student: {
        connect: {
          student_no,
        },
      },
    },
  });

  const result = {
    data: identity_card,
    status: 200,
  };

  res.json(result);
});

export default router;
