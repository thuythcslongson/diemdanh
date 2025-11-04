export interface AbsentStudentInfo {
  studentId: string;
  studentName:string;
  reason: string;
}

export interface AttendanceRecord {
  id: string; // unique key, e.g., `YYYY-MM-DD-GRADE-CLASS-SESSION-PERIOD`
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  teacherName: string;
  grade: number;
  className: string;
  session: 'Sáng' | 'Chiều';
  period: number; // Tiết học
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  absentStudents: AbsentStudentInfo[];
}