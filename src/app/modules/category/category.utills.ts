import { ICategory, NestedCategory } from "./category.interface";

export const nestedCategories = (categories: ICategory[], parentId: string | null = null): NestedCategory[] => {
    const categoryList: NestedCategory[] = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => !cat.parentId);
    } else {
        category = categories.filter(
            (cat) => String(cat.parentId) === String(parentId)
        );
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            image: cate.image,
            isFeatured: cate.isFeatured,
            children: nestedCategories(categories, cate._id?.toString() ?? null),
        });
    }

    return categoryList;
}