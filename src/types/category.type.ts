export type CategoryFilter = {
  keyword?: string;
  isActive?: boolean | string;
  page?: number;
  limit?: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
