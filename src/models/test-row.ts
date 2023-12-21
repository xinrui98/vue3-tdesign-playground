// models.ts
export type TableRow = {
  index: number;
  applicant: string;
  channel: string;
  detail: {
    email: string;
  };
  matters: string;
  time: number;
  createTime: string;
};
