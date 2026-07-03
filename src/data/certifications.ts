import certificationsData from "./json/certifications.json";

export interface Certification {
  title: string;
  /** YYYY-MM format */
  date: string;
  link?: string;
  icon?: string;
  iconImage?: string;
}

export const CERTIFICATIONS: Certification[] =
  certificationsData as Certification[];
