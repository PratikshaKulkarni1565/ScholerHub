export interface IScholarship {
  _id: string;
  title: string;
  description: string;
  eligibility: {
    educationLevel: string[];
    fieldOfStudy: string[];
    states: string[];
    minPercentage?: number;
    incomeLimit?: number;
  };
  amount: string;
  benefits: string;
  deadline: string | Date;
  category: "Government" | "State Government" | "Private" | "International";
  location: "India" | "Abroad" | "Both";
  provider: string;
  link: string;
  featured: boolean;
  howToApply: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  profile: {
    educationLevel: string;
    fieldOfStudy: string;
    state: string;
    caste: string;
    phone?: string;
  };
  bookmarks: string[];
  createdAt: string | Date;
}

export interface FilterState {
  educationLevel: string;
  category: string;
  location: string;
  fieldOfStudy: string;
  search: string;
  deadline: string;
}
