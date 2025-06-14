export type BrandFilter = {
  keyword?: string;
  isActive?: boolean | string;
  page?: number;
  limit?: number;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
