import { z } from "zod";

const createSlider = z.object({
    body: z.object({
        linkUrl: z.string().min(1).max(1000),
        order: z.preprocess((val) => Number(val), z.number().min(1)).optional(),
        isActive: z.boolean().optional(),
    })
});

const updateSlider = z.object({
    body: z.object({
        linkUrl: z.string().min(1).max(1000).optional(),
        order: z.preprocess((val) => Number(val), z.number().positive()).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string({ required_error: "Id is required" })
    })
});

const deleteSlider = z.object({
    params: z.object({
        id: z.string({ required_error: "Id is required" })
    })
});

const getSlider = z.object({
    params: z.object({
        id: z.string({ required_error: "Id is required" })
    })
});

export const SliderValidations = {
    createSlider,
    updateSlider,
    deleteSlider,
    getSlider
};
