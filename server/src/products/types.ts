export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  ageRange: string;
  tags: string[];
  teacherName: string;
  teacherPhone: string;
  createdAt: Date;
}

export interface FindAllParams {
  category?: string;
  keyword?: string;
  page: number;
  limit: number;
}
