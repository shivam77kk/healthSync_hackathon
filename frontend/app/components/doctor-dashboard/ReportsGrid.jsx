import ReportCard from "./ReportCard"

const reportsData = [
  {
    id: 1,
    patient: "Sam Doe",
    document: "Blood Test Report",
    dateUploaded: "Aug 22,2025",
    status: "Reviewed",
  },
  {
    id: 2,
    patient: "Yash Chavan",
    document: "MRI Scan",
    dateUploaded: "Sept 01,2025",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Asmi Patil",
    document: "X-Ray",
    dateUploaded: "sept 01,2025",
    status: "Reviewed",
  },
  {
    id: 4,
    patient: "Yash Bhosale",
    document: "ECG Report",
    dateUploaded: "Aug 24,2025",
    status: "Pending",
  },
  {
    id: 5,
    patient: "Saksham Nikam",
    document: "Diabetes Report",
    dateUploaded: "Jan 20,2025",
    status: "Reviewed",
  },
  {
    id: 6,
    patient: "Sanika Jagde",
    document: "Sugar Report",
    dateUploaded: "Dec 13,2025",
    status: "Pending",
  },
  {
    id: 7,
    patient: "Vinit Shelar",
    document: "Brain X-Ray",
    dateUploaded: "Feb 18,2025",
    status: "Reviewed",
  },
  {
    id: 8,
    patient: "Aniket More",
    document: "Asthma Report",
    dateUploaded: "Mar 04,2025",
    status: "Pending",
  },
  {
    id: 9,
    patient: "Shravni Dalvi",
    document: "Thairoid Report",
    dateUploaded: "April 09,2025",
    status: "Pending",
  },
  {
    id: 10,
    patient: "Ayush Nagarkar",
    document: "Cancer Report",
    dateUploaded: "Oct 05,2024",
    status: "Reviewed",
  },
]

export default function ReportsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
      {reportsData.map((report, index) => (
        <ReportCard key={report.id} report={report} index={index} />
      ))}
    </div>
  )
}
