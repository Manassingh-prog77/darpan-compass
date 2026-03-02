export interface Representative {
  id: string; name: string; role: string; constituency: string;
  population: number; budgetAllocated: number; budgetUsed: number;
  imageScore: number; openComplaints: number;
}
export interface Task {
  id: string; repId: string; title: string; status: "Pending" | "In Progress" | "Completed";
  assigned: string; completed?: string; proofs: string[];
  publicValidation?: { confirmed: number; disputed: number; responses: number };
  assignedBy?: string;
}
export interface Expense {
  id: string; repId: string; date: string; amount: number; category: string;
  proof: string; status: "Pending" | "Verified" | "Disputed";
  clarifications?: { actor: string; text: string; time: string }[];
}
export interface Complaint {
  id: string; repId: string; title: string; status: "Open" | "Acknowledged" | "Responded" | "Resolved" | "Overdue";
  submitted: string; location: string; images: string[];
  timeline?: { event: string; time: string }[];
}
export interface Poll { id: string; taskId: string; question: string; options: { label: string; count: number }[]; }
export interface SocialNarrative {
  id: string; repId: string; platform: string; excerpt: string;
  date: string; sentiment: "positive" | "negative" | "neutral"; constituency: string;
  occurrences?: number;
}
export interface MediaVerification {
  id: string; clip: string; candidates: { url: string; confidence: number; timecode: string }[];
  status: "partial_match" | "verified_full" | "misleading";
}
export interface AuditEntry { id: string; actor: string; action: string; timestamp: string; }
export interface MockData {
  representatives: Representative[]; tasks: Task[]; expenses: Expense[];
  complaints: Complaint[]; polls: Poll[]; socialNarratives: SocialNarrative[];
  mediaVerification: MediaVerification[]; auditLog: AuditEntry[];
}

export const initialMockData: MockData = {
  representatives: [
    {id:"rep-001",name:"Anand Singh",role:"MP",constituency:"Varanasi",population:2000000,budgetAllocated:5000000,budgetUsed:2100000,imageScore:78,openComplaints:14},
    {id:"rep-002",name:"Priya Rao",role:"MP",constituency:"Hyderabad",population:1200000,budgetAllocated:4000000,budgetUsed:3800000,imageScore:62,openComplaints:32},
    {id:"rep-003",name:"Ravi Kumar",role:"Worker",constituency:"Patna North",population:450000,budgetAllocated:300000,budgetUsed:120000,imageScore:81,openComplaints:4},
    {id:"rep-004",name:"Meera Desai",role:"MP",constituency:"Ahmedabad",population:1400000,budgetAllocated:4500000,budgetUsed:1800000,imageScore:85,openComplaints:8},
    {id:"rep-005",name:"Suresh Patil",role:"Worker",constituency:"Pune West",population:600000,budgetAllocated:350000,budgetUsed:90000,imageScore:90,openComplaints:2},
    {id:"rep-006",name:"Asha Reddy",role:"MP",constituency:"Visakhapatnam",population:900000,budgetAllocated:4200000,budgetUsed:2100000,imageScore:70,openComplaints:20},
    {id:"rep-007",name:"Vikram Singh",role:"MP",constituency:"Jaipur",population:800000,budgetAllocated:3800000,budgetUsed:1100000,imageScore:74,openComplaints:10},
    {id:"rep-008",name:"Fatima Khan",role:"Worker",constituency:"Srinagar South",population:300000,budgetAllocated:200000,budgetUsed:50000,imageScore:88,openComplaints:1},
  ],
  tasks: [
    {id:"task-1001",repId:"rep-001",title:"Road repair near Sector 4",status:"Completed",assigned:"2026-01-10",completed:"2026-02-10",proofs:["/mock/road1.jpg"],publicValidation:{confirmed:78,disputed:22,responses:500},assignedBy:"State Admin"},
    {id:"task-1002",repId:"rep-002",title:"Community health camp",status:"In Progress",assigned:"2026-01-20",proofs:[],assignedBy:"State Admin"},
    {id:"task-1003",repId:"rep-004",title:"School renovation - Block A",status:"Pending",assigned:"2026-02-01",proofs:[],assignedBy:"Party Head"},
    {id:"task-1004",repId:"rep-005",title:"Street lights installation",status:"Completed",assigned:"2025-12-10",completed:"2026-01-12",proofs:["/mock/lights.jpg"],publicValidation:{confirmed:92,disputed:8,responses:220},assignedBy:"State Admin"},
    {id:"task-1005",repId:"rep-006",title:"Clean water pipeline - Phase 1",status:"In Progress",assigned:"2026-01-05",proofs:[],assignedBy:"Party Head"},
    {id:"task-1006",repId:"rep-007",title:"Community centre setup",status:"Pending",assigned:"2026-02-14",proofs:[],assignedBy:"State Admin"},
    {id:"task-1007",repId:"rep-003",title:"Local market sanitation",status:"Completed",assigned:"2025-11-10",completed:"2025-12-04",proofs:["/mock/market1.jpg"],publicValidation:{confirmed:85,disputed:15,responses:120},assignedBy:"State Admin"},
    {id:"task-1008",repId:"rep-002",title:"Public park greenery drive",status:"Completed",assigned:"2026-01-05",completed:"2026-01-25",proofs:["/mock/park.jpg"],publicValidation:{confirmed:65,disputed:35,responses:150},assignedBy:"Party Head"},
    {id:"task-1009",repId:"rep-004",title:"Flood drainage check",status:"In Progress",assigned:"2026-02-10",proofs:[],assignedBy:"State Admin"},
    {id:"task-1010",repId:"rep-001",title:"Community skill workshop",status:"Pending",assigned:"2026-02-20",proofs:[],assignedBy:"Party Head"},
    {id:"task-1011",repId:"rep-006",title:"Health awareness campaign",status:"Completed",assigned:"2025-12-12",completed:"2026-01-20",proofs:["/mock/healthcamp.jpg"],publicValidation:{confirmed:58,disputed:42,responses:90},assignedBy:"State Admin"},
    {id:"task-1012",repId:"rep-007",title:"Street cleaning drive",status:"In Progress",assigned:"2026-01-16",proofs:[],assignedBy:"State Admin"},
  ],
  expenses: [
    {id:"exp-2001",repId:"rep-001",date:"2026-02-25",amount:500000,category:"Infrastructure",proof:"/mock/invoice1.pdf",status:"Pending"},
    {id:"exp-2002",repId:"rep-002",date:"2026-01-15",amount:1250000,category:"Healthcare",proof:"/mock/invoice2.pdf",status:"Verified"},
    {id:"exp-2003",repId:"rep-004",date:"2026-02-02",amount:250000,category:"Education",proof:"/mock/invoice3.pdf",status:"Pending"},
    {id:"exp-2004",repId:"rep-005",date:"2025-12-20",amount:80000,category:"Public Works",proof:"/mock/invoice4.pdf",status:"Verified"},
    {id:"exp-2005",repId:"rep-006",date:"2026-01-30",amount:200000,category:"Water",proof:"/mock/invoice5.pdf",status:"Disputed"},
    {id:"exp-2006",repId:"rep-007",date:"2026-02-12",amount:150000,category:"Community",proof:"/mock/invoice6.pdf",status:"Pending"},
    {id:"exp-2007",repId:"rep-001",date:"2026-02-10",amount:75000,category:"Materials",proof:"/mock/invoice7.pdf",status:"Verified"},
    {id:"exp-2008",repId:"rep-002",date:"2026-01-08",amount:50000,category:"Transport",proof:"/mock/invoice8.pdf",status:"Verified"},
    {id:"exp-2009",repId:"rep-003",date:"2025-11-20",amount:30000,category:"Tools",proof:"/mock/invoice9.pdf",status:"Verified"},
    {id:"exp-2010",repId:"rep-004",date:"2026-02-18",amount:100000,category:"Emergency",proof:"/mock/invoice10.pdf",status:"Pending"},
    {id:"exp-2011",repId:"rep-006",date:"2026-01-05",amount:45000,category:"Awareness",proof:"/mock/invoice11.pdf",status:"Verified"},
    {id:"exp-2012",repId:"rep-007",date:"2026-02-22",amount:220000,category:"Infrastructure",proof:"/mock/invoice12.pdf",status:"Pending"},
  ],
  complaints: [
    {id:"comp-3001",repId:"rep-002",title:"Drainage overflow - Ward 12",status:"Open",submitted:"2026-02-24",location:"Ward 12",images:["/mock/drain.jpg"],timeline:[{event:"Submitted",time:"2026-02-24T09:00:00Z"}]},
    {id:"comp-3002",repId:"rep-001",title:"Broken streetlight - Sector 5",status:"Responded",submitted:"2026-02-10",location:"Sector 5",images:["/mock/light_broken.jpg"],timeline:[{event:"Submitted",time:"2026-02-10T10:00:00Z"},{event:"Acknowledged",time:"2026-02-11T08:00:00Z"},{event:"Responded",time:"2026-02-14T14:00:00Z"}]},
    {id:"comp-3003",repId:"rep-004",title:"School boundary repair",status:"Resolved",submitted:"2026-01-30",location:"Block A",images:["/mock/school.jpg"],timeline:[{event:"Submitted",time:"2026-01-30T11:00:00Z"},{event:"Resolved",time:"2026-02-15T16:00:00Z"}]},
    {id:"comp-3004",repId:"rep-006",title:"Polluted water outlet",status:"Open",submitted:"2026-02-15",location:"Colony 3",images:["/mock/water1.jpg"],timeline:[{event:"Submitted",time:"2026-02-15T12:00:00Z"}]},
    {id:"comp-3005",repId:"rep-007",title:"Illegal dumping site",status:"Open",submitted:"2026-02-20",location:"Zone 7",images:["/mock/dump.jpg"],timeline:[{event:"Submitted",time:"2026-02-20T09:30:00Z"}]},
    {id:"comp-3006",repId:"rep-003",title:"Market sanitation issue",status:"Resolved",submitted:"2025-12-05",location:"Market Road",images:["/mock/market1.jpg"],timeline:[{event:"Submitted",time:"2025-12-05T08:00:00Z"},{event:"Resolved",time:"2025-12-20T10:00:00Z"}]},
    {id:"comp-3007",repId:"rep-002",title:"Noise pollution at night",status:"Acknowledged",submitted:"2026-02-23",location:"Ward 9",images:[],timeline:[{event:"Submitted",time:"2026-02-23T22:00:00Z"},{event:"Acknowledged",time:"2026-02-24T08:00:00Z"}]},
    {id:"comp-3008",repId:"rep-005",title:"Lamp post leaning dangerously",status:"Resolved",submitted:"2025-11-18",location:"Street 12",images:["/mock/lamp.jpg"],timeline:[{event:"Submitted",time:"2025-11-18T14:00:00Z"},{event:"Resolved",time:"2025-12-01T12:00:00Z"}]},
    {id:"comp-3009",repId:"rep-001",title:"Road potholes - Lane 3",status:"Open",submitted:"2026-02-12",location:"Lane 3",images:["/mock/pothole.jpg"],timeline:[{event:"Submitted",time:"2026-02-12T07:00:00Z"}]},
    {id:"comp-3010",repId:"rep-006",title:"No potable water - Block 2",status:"Open",submitted:"2026-02-02",location:"Block 2",images:["/mock/water2.jpg"],timeline:[{event:"Submitted",time:"2026-02-02T06:00:00Z"}]},
    {id:"comp-3011",repId:"rep-008",title:"Street sign missing",status:"Resolved",submitted:"2025-10-07",location:"Main Ave",images:[],timeline:[{event:"Submitted",time:"2025-10-07T10:00:00Z"},{event:"Resolved",time:"2025-10-20T15:00:00Z"}]},
    {id:"comp-3012",repId:"rep-004",title:"Flooding near drain 9",status:"Responded",submitted:"2026-02-17",location:"Drain 9",images:["/mock/flood.jpg"],timeline:[{event:"Submitted",time:"2026-02-17T11:00:00Z"},{event:"Responded",time:"2026-02-19T09:00:00Z"}]},
    {id:"comp-3013",repId:"rep-007",title:"Bus stop damaged",status:"Open",submitted:"2026-02-18",location:"Stop 22",images:["/mock/busstop.jpg"],timeline:[{event:"Submitted",time:"2026-02-18T13:00:00Z"}]},
    {id:"comp-3014",repId:"rep-002",title:"Park lights not working",status:"Acknowledged",submitted:"2026-02-21",location:"Park East",images:["/mock/park.jpg"],timeline:[{event:"Submitted",time:"2026-02-21T20:00:00Z"},{event:"Acknowledged",time:"2026-02-22T07:00:00Z"}]},
  ],
  polls: [
    {id:"poll-01",taskId:"task-1001",question:"Was the road repair completed as claimed?",options:[{label:"Yes",count:390},{label:"No",count:110}]},
    {id:"poll-02",taskId:"task-1004",question:"Are street lights installed and functional?",options:[{label:"Yes",count:200},{label:"No",count:20}]},
    {id:"poll-03",taskId:"task-1008",question:"Was the park greenery drive completed well?",options:[{label:"Yes",count:98},{label:"No",count:52}]},
    {id:"poll-04",taskId:"task-1011",question:"Was the health camp useful?",options:[{label:"Yes",count:52},{label:"No",count:38}]},
  ],
  socialNarratives: [
    {id:"n-501",repId:"rep-001",platform:"Twitter",excerpt:"Rep Anand promised but the road is unfinished",date:"2026-02-26",sentiment:"negative",constituency:"Varanasi",occurrences:23},
    {id:"n-502",repId:"rep-002",platform:"Instagram",excerpt:"Health camp cancelled last minute",date:"2026-02-24",sentiment:"negative",constituency:"Hyderabad",occurrences:45},
    {id:"n-503",repId:"rep-004",platform:"Facebook",excerpt:"School renovation looks incomplete",date:"2026-02-20",sentiment:"neutral",constituency:"Ahmedabad",occurrences:12},
    {id:"n-504",repId:"rep-006",platform:"Twitter",excerpt:"Water supply still irregular in colony 3",date:"2026-02-25",sentiment:"negative",constituency:"Visakhapatnam",occurrences:31},
    {id:"n-505",repId:"rep-001",platform:"Facebook",excerpt:"Community skill workshop was well organised",date:"2026-02-12",sentiment:"positive",constituency:"Varanasi",occurrences:18},
    {id:"n-506",repId:"rep-007",platform:"Twitter",excerpt:"Bus stop damaged, no action yet",date:"2026-02-18",sentiment:"negative",constituency:"Jaipur",occurrences:9},
    {id:"n-507",repId:"rep-003",platform:"Instagram",excerpt:"Market sanitation improved after cleanup",date:"2025-12-12",sentiment:"positive",constituency:"Patna North",occurrences:7},
    {id:"n-508",repId:"rep-004",platform:"Twitter",excerpt:"Flooding near drain 9 still an issue",date:"2026-02-16",sentiment:"negative",constituency:"Ahmedabad",occurrences:27},
  ],
  mediaVerification: [
    {id:"m-9001",clip:"/mock/clip1.mp4",candidates:[{url:"https://youtube.mock/full1",confidence:0.82,timecode:"00:00:00-00:01:45"},{url:"https://fb.mock/fullA",confidence:0.63,timecode:"00:00:00-00:03:12"}],status:"partial_match"},
    {id:"m-9002",clip:"/mock/clip2.mp4",candidates:[{url:"https://youtube.mock/full2",confidence:0.91,timecode:"00:00:00-00:02:00"}],status:"verified_full"},
  ],
  auditLog: [
    {id:"a-1",actor:"PartyHead",action:"Verified expense exp-2002",timestamp:"2026-02-26T09:34:00Z"},
    {id:"a-2",actor:"MP:Anand Singh",action:"Uploaded proof for task-1001",timestamp:"2026-02-10T12:14:00Z"},
  ],
};

export const i18n: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", representatives: "Representatives", budgets: "Budgets",
    grievances: "Grievances", analytics: "Analytics", settings: "Settings", help: "Help",
    totalComplaints: "Total Complaints", avgResponseTime: "Avg Response Time",
    activeRiskFlags: "Active Risk Flags", fundsUtilized: "Funds Utilized",
    aiPublicImage: "AI Public Image", workTodo: "Work & To-Do",
    budgetAllocation: "Budget & Expenditure", publicComplaints: "Complaints & Grievances",
    search: "Search by name or constituency...", notifications: "Notifications",
    presenterMode: "Presenter Mode", citizenPortal: "Citizen Portal",
    reportComplaint: "Report Complaint", verifyWork: "Verify Work",
    participateInPoll: "Participate in Poll", askAI: "Ask AI Avatar",
    submit: "Submit", cancel: "Cancel", verify: "Verify", dispute: "Dispute",
    escalate: "Escalate", approve: "Approve", generateBrief: "Generate Brief",
    auditLog: "Audit Log", exportCSV: "Export CSV",
  },
  hi: {
    dashboard: "डैशबोर्ड", representatives: "प्रतिनिधि", budgets: "बजट",
    grievances: "शिकायतें", analytics: "विश्लेषण", settings: "सेटिंग्स", help: "सहायता",
    totalComplaints: "कुल शिकायतें", avgResponseTime: "औसत प्रतिक्रिया समय",
    activeRiskFlags: "सक्रिय जोखिम", fundsUtilized: "निधि उपयोग",
    aiPublicImage: "AI जन छवि", workTodo: "कार्य और टू-डू",
    budgetAllocation: "बजट और व्यय", publicComplaints: "शिकायतें और समस्याएं",
    search: "नाम या निर्वाचन क्षेत्र खोजें...", notifications: "सूचनाएं",
    presenterMode: "प्रस्तुतकर्ता मोड", citizenPortal: "नागरिक पोर्टल",
    reportComplaint: "शिकायत दर्ज करें", verifyWork: "कार्य सत्यापित करें",
    participateInPoll: "मतदान में भाग लें", askAI: "AI से पूछें",
    submit: "जमा करें", cancel: "रद्द करें", verify: "सत्यापित", dispute: "विवाद",
    escalate: "बढ़ाएं", approve: "स्वीकृत", generateBrief: "संक्षिप्त बनाएं",
    auditLog: "ऑडिट लॉग", exportCSV: "CSV निर्यात",
  },
  te: {
    dashboard: "డ్యాష్‌బోర్డ్", representatives: "ప్రతినిధులు", budgets: "బడ్జెట్",
    grievances: "ఫిర్యాదులు", analytics: "విశ్లేషణ", settings: "సెట్టింగ్‌లు", help: "సహాయం",
    totalComplaints: "మొత్తం ఫిర్యాదులు", avgResponseTime: "సగటు ప్రతిస్పందన సమయం",
    activeRiskFlags: "సక్రియ రిస్క్ ఫ్లాగ్‌లు", fundsUtilized: "నిధుల వినియోగం",
    search: "పేరు లేదా నియోజకవర్గం ద్వారా వెతకండి...",
    submit: "సమర్పించు", cancel: "రద్దు చేయి",
  },
};
