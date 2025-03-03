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
  include: {};
};

router.get("/", async (req, res, next) => {
  const { college_id, name } = req.query;

  let college;

  let whereArr: CollegeWhere = {
    where: {
      is_deleted: false,
    },
    include: {
      Media: true,
      IdentityCard: true,
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

  let results = await prisma.college.findMany(whereArr);

  if (results.length === 1) {
    college = await prisma.college.findFirst(whereArr);
  }

  const result = {
    data: college,
    status: 200,
    queryParams: whereArr,
  };

  res.json(result);
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
