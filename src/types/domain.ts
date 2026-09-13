export interface UserSummary {
  id: number;
  name: string;
  email: string;
  roles: string[];
  institutionId?: number;
  campusId?: number;
  userType: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSummary;
}

export interface Institution {
  id: number;
  code: string;
  name: string;
  institutionType: string;
  city: string;
  state: string;
  currency: string;
}

export interface Campus {
  id: number;
  code: string;
  name: string;
  city: string;
  campusHeadName: string;
}

export interface AcademicYear {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export interface Program {
  id: number;
  code: string;
  name: string;
  shortName?: string;
  level: string;
  totalSemestersOrYears: number;
  department?: Department;
}

export interface Semester {
  id: number;
  semesterNumber: number;
  name: string;
}

export interface SchoolClass {
  id: number;
  name: string;
  gradeLevel: number;
  capacity: number;
}

export interface Section {
  id: number;
  name: string;
  capacity: number;
  schoolClass?: SchoolClass;
  program?: Program;
  semester?: Semester;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  subjectType: string;
  credits: number;
  maxMarks: number;
  passMarks: number;
}

export interface Student {
  id: number;
  admissionNumber: string;
  rollNumber?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  category: string;
  admissionDate: string;
  currentStatus: string;
}

export interface Enrollment {
  id: number;
  student: Student;
  academicYear: AcademicYear;
  program?: Program;
  semester?: Semester;
  schoolClass?: SchoolClass;
  section: Section;
  enrollmentDate: string;
  status: string;
}

export interface Faculty {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  designation: string;
  qualification: string;
  email: string;
  phone: string;
  department?: Department;
}

export interface Classroom {
  id: number;
  roomNumber: string;
  building: string;
  capacity: number;
  roomType: string;
}

export interface TimetableEntry {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  section: Section;
  subject: Subject;
  faculty: Faculty;
  classroom: Classroom;
}

export interface AttendanceSession {
  id: number;
  sessionDate: string;
  sessionType: string;
  section: Section;
  subject?: Subject;
  takenByFaculty: Faculty;
}

export interface StudentAttendance {
  id: number;
  student: Student;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'ON_LEAVE';
  remarks?: string;
}

export interface AttendanceStats {
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  attendancePercentage: number;
  shortageAlert: boolean;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  maxMarks: number;
  assignedDate: string;
  dueDate: string;
  subject: Subject;
  section: Section;
  faculty: Faculty;
  status: string;
}

export interface AssignmentSubmission {
  id: number;
  assignment: Assignment;
  student: Student;
  submissionDate: string;
  textContent?: string;
  obtainedMarks?: number;
  feedback?: string;
  status: string;
}

export interface Exam {
  id: number;
  code: string;
  name: string;
  examType: string;
  startDate: string;
  endDate: string;
  status: string;
  academicYear: AcademicYear;
}

export interface ExamSchedule {
  id: number;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  minPassMarks: number;
  subject: Subject;
  classroom?: Classroom;
}

export interface StudentMark {
  id: number;
  internalMarks: number;
  externalMarks: number;
  practicalMarks: number;
  totalMarks: number;
  isAbsent: boolean;
  gradeLetter?: string;
  gradePoint?: number;
}

export interface ReportCardDto {
  studentName: string;
  admissionNumber: string;
  rollNumber: string;
  examName: string;
  academicYear: string;
  subjectMarks: {
    subjectCode: string;
    subjectName: string;
    maxMarks: number;
    passMarks: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
  }[];
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  gpa: number;
  overallResult: string;
  isPublished: boolean;
}

export interface FeeCategory {
  id: number;
  name: string;
  code: string;
}

export interface FeeStructure {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  feeCategory: FeeCategory;
  academicYear: AcademicYear;
}

export interface FeeInstallment {
  id: number;
  installmentNumber: number;
  title: string;
  amount: number;
  dueDate: string;
  paidAmount: number;
  penaltyAmount: number;
  status: string;
}

export interface StudentFeeAccount {
  id: number;
  student: Student;
  academicYear: AcademicYear;
  totalFeeAmount: number;
  scholarshipAmount: number;
  concessionAmount: number;
  penaltyAmount: number;
  netPayableAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  accountStatus: string;
  installments?: FeeInstallment[];
}

export interface Payment {
  id: number;
  receiptNumber: string;
  paymentReference: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  student: Student;
  remarks?: string;
}

export interface Book {
  id: number;
  isbn?: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation?: string;
}

export interface Vehicle {
  id: number;
  registrationNumber: string;
  vehicleType: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
}

export interface TransportRoute {
  id: number;
  routeNumber: string;
  routeName: string;
  startLocation: string;
  endLocation: string;
  annualFee: number;
}

export interface Hostel {
  id: number;
  name: string;
  genderType: string;
  wardenName: string;
  wardenPhone: string;
  totalRooms: number;
}

export interface LeaveRequest {
  id: number;
  userType: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: string;
  reviewRemarks?: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  audience: string;
  priority: string;
  publishedDate: string;
}

export interface AdminDashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  facultyCount: number;
  staffCount: number;
  applicationCount: number;
  admittedCount: number;
  totalFeeCollected: number;
  totalOutstandingFees: number;
  upcomingExamsCount: number;
  studentToFacultyRatio: number;
}
