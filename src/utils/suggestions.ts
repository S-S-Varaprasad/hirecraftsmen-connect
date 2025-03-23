
// Common data for autocomplete suggestions across the application

// Indian States
export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Union Territories
export const indianUnionTerritories = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Major cities in India by state
export const indianCities = [
  // Andhra Pradesh
  "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada", "Tirupati", "Rajahmundry", "Kadapa", "Anantapur",
  // Arunachal Pradesh
  "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Tezu", "Namsai",
  // Assam
  "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon",
  // Bihar
  "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Katihar", "Munger",
  // Chhattisgarh
  "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur", "Ambikapur",
  // Goa
  "Panaji", "Margao", "Vasco da Gama", "Ponda", "Mapusa", "Bicholim",
  // Gujarat
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Bharuch",
  // Haryana
  "Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula",
  // Himachal Pradesh
  "Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Kullu", "Hamirpur", "Una", "Baddi",
  // Jharkhand
  "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh",
  // Karnataka
  "Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Shimoga", "Tumkur",
  // Kerala
  "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kottayam", "Palakkad", "Alappuzha", "Kannur", "Kasaragod",
  // Madhya Pradesh
  "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa",
  // Maharashtra
  "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded",
  // Manipur
  "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Senapati",
  // Meghalaya
  "Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar",
  // Mizoram
  "Aizawl", "Lunglei", "Champhai", "Saiha", "Kolasib",
  // Nagaland
  "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha",
  // Odisha
  "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak",
  // Punjab
  "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur",
  // Rajasthan
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar", "Sri Ganganagar",
  // Sikkim
  "Gangtok", "Namchi", "Mangan", "Gyalshing", "Rangpo",
  // Tamil Nadu
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Dindigul",
  // Telangana
  "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda",
  // Tripura
  "Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia",
  // Uttar Pradesh
  "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly", "Aligarh", "Moradabad",
  // Uttarakhand
  "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh",
  // West Bengal
  "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Kharagpur", "Darjeeling", "Jalpaiguri", "Baharampur",
  // Delhi NCR
  "New Delhi", "Noida", "Ghaziabad", "Gurugram", "Faridabad", "Greater Noida",
  // Union Territories
  "Port Blair", "Silvassa", "Daman", "Diu", "Kavaratti", "Pondicherry"
];

// Combine states, union territories, and cities for a comprehensive list
export const allIndianRegions = [
  ...indianStates, 
  ...indianUnionTerritories,
  ...indianCities
];

// Common professions/job categories
export const professions = [
  "Carpenter",
  "Plumber",
  "Electrician",
  "Painter",
  "Mason",
  "Mechanic",
  "Driver",
  "Chef",
  "Cleaner",
  "Security Guard",
  "Gardener",
  "Tailor",
  "Construction Worker",
  "Welder",
  "HVAC Technician",
  "Roofer",
  "Landscaper",
  "Appliance Repair",
  "Flooring Installer",
  "Glass Installer",
  "Handyman",
  "Home Inspector",
  "Interior Designer",
  "Locksmith",
  "Pest Control",
];

// Languages spoken in India
export const indianLanguages = [
  "Hindi",
  "English",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Assamese",
  "Maithili",
  "Sanskrit",
];

// Skills relevant to professions
export const skills = [
  "Woodworking",
  "Piping",
  "Wiring",
  "Circuit Repair",
  "Welding",
  "Painting",
  "Plastering",
  "Bricklaying",
  "Tiling",
  "Engine Repair",
  "Plumbing",
  "Electrical Work",
  "Carpentry",
  "Masonry",
  "HVAC",
  "Roofing",
  "Flooring",
  "Drywall Installation",
  "Cabinet Making",
  "Concrete Work",
  "Equipment Operation",
  "Blueprint Reading",
  "Precision Measurement",
  "Power Tool Operation",
  "Safety Procedures",
  "Maintenance",
  "Troubleshooting",
  "Installation",
  "Repair",
  "Customer Service",
];

// Common search terms users might look for
export const commonSearchTerms = [
  "Electrician near me",
  "Plumber for bathroom",
  "Carpenter for furniture",
  "House painter",
  "Emergency plumber",
  "Gardener weekly service",
  "Kitchen renovation worker",
  "Bathroom remodeling",
  "Handyman for small jobs",
  "Air conditioner repair",
  "Roof repair",
  "Electrician for wiring",
  "Plumber for leaking pipe",
  "Carpenter for door repair",
  "Painters for house exterior",
  "Carpenter for furniture assembly",
  "Driver for local travel",
  "Cleaner for home",
  "Security guard for event",
  "Gardener for landscaping",
];

// Popular locations
export const popularLocations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
];
