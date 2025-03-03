import { prisma } from "@/src/helper/prisma";
import express from "express";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const identity_card = await prisma.identityCard.findMany({
    include: {
      College: {
        include: {
          Media: true,
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
