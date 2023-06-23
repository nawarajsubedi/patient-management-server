import { Patient } from "@prisma/client";

export interface PaginationPatientResponse {
  pagination: {
    total: number;
    page: number;
    size: number;
  };
  data: Patient[];
}
