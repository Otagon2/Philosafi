/**
 * Philosafi Portfolio - Slides Data
 * Safiullah Khan - Principal UX Researcher | Service Designer
 * 
 * LAYOUT: Slides are arranged in a grid pattern
 * Each slide has: id, title, subtitle, description, theme, position (row, col), and narration
 */

const slidesData = [
    // ==========================================
    // ROW 0: INTRODUCTION
    // ==========================================
    {
        id: 1,
        row: 0,
        col: 0,
        title: "Safiullah Khan",
        subtitle: "Principal UX Researcher",
        description: "Specializing in <em>Strategic Discovery & Service Design</em>. 15+ years helping organizations navigate ambiguity and build products that truly resonate.",
        signature: "Philosafi",
        link: { text: "Learn more", url: "#about" },
        theme: "dark",
        section: "Home",
        narration: "Welcome to my portfolio. I'm Safiullah Khan, also known as Philosafi. I'm a Principal UX Researcher specializing in Strategic Discovery and Service Design. With over 15 years of experience, I help organizations navigate ambiguity and build products that truly resonate with users."
    },
    {
        id: 2,
        row: 0,
        col: 1,
        title: "About Me",
        subtitle: "Ex-Microsoft | NID Faculty",
        description: "A Senior UX Researcher and Service Designer with a foundation in Computer Science and a decade in design leadership. I bridge technical constraints with human needs.",
        theme: "dark",
        section: "Who Am I",
        narration: "I'm a Senior UX Researcher and Service Designer with a foundation in Computer Science and over a decade in design leadership. My strength lies in bridging technical constraints with genuine human needs, focusing on strategic risk mitigation rather than just data delivery."
    },
    {
        id: 3,
        row: 0,
        col: 2,
        title: "My Philosophy",
        subtitle: "Design Approach",
        description: "<em>\"Designing the right thing > Designing the thing right.\"</em> I focus on strategic discovery to ensure we're solving problems worth solving.",
        theme: "light",
        narration: "My philosophy is simple: Designing the right thing is more important than designing the thing right. I focus on strategic discovery to ensure we're solving problems that are truly worth solving before diving into solutions."
    },

    // ==========================================
    // ROW 1-2: MICROSOFT EXPERIENCE
    // ==========================================
    {
        id: 4,
        row: 1,
        col: 0,
        title: "Microsoft",
        subtitle: "UX Researcher II",
        description: "Led strategic research for Windows & Devices and Microsoft Family Safety. SPOC for multiple product squads at India Development Center.",
        theme: "accent",
        section: "Work",
        subsection: "Microsoft",
        narration: "At Microsoft, I served as UX Researcher II, leading strategic research for Windows and Devices, as well as Microsoft Family Safety products. I was the single point of contact for multiple product squads at the India Development Center."
    },
    {
        id: 5,
        row: 1,
        col: 1,
        title: "Research Impact",
        subtitle: "Cross-platform Features",
        description: "Conducted research to improve cross-platform feature discoverability and nomenclature - the 'AirDrop on Windows + Android' initiative.",
        theme: "light",
        narration: "One of my key contributions was conducting research to improve cross-platform feature discoverability. This included work on what became known as the 'AirDrop on Windows plus Android' initiative, improving how users share files across different platforms."
    },
    {
        id: 6,
        row: 1,
        col: 2,
        title: "K12 Education",
        subtitle: "Microsoft Teams",
        description: "Influenced K-12 education product incubations for Microsoft Teams during the pandemic, shaping how students and teachers collaborate remotely.",
        theme: "light",
        narration: "During the pandemic, I influenced K-12 education product incubations for Microsoft Teams, helping shape how students and teachers collaborate remotely during an unprecedented time in education."
    },
    {
        id: 7,
        row: 2,
        col: 0,
        title: "Methods & Skills",
        subtitle: "Research Toolkit",
        description: "Research Design, User Interviews, Usability Testing, Data Analysis, Trend Analysis, and Strategic Discovery.",
        theme: "dark",
        narration: "My research toolkit at Microsoft included Research Design, User Interviews, Usability Testing, Data Analysis, and Trend Analysis, all focused on Strategic Discovery to inform product direction."
    },
    {
        id: 8,
        row: 2,
        col: 1,
        title: "Outcome",
        subtitle: "2020 - 2023",
        description: "2 years 8 months of strategic research influencing Windows, Devices, and Family Safety product roadmaps at Microsoft.",
        theme: "green",
        narration: "Over two years and eight months, my strategic research influenced the roadmaps for Windows, Devices, and Family Safety products, contributing to features used by millions of users worldwide."
    },

    // ==========================================
    // ROW 3-4: THINK DESIGN / TATA CLASSEDGE
    // ==========================================
    {
        id: 9,
        row: 3,
        col: 0,
        title: "Think Design",
        subtitle: "Deputy Design Head",
        description: "8+ years leading design for Indian Navy, GE, Honeywell, Tata Group, and Oppo. Achieved studio revenue of ₹15M in 10 months.",
        theme: "accent",
        subsection: "Think Design",
        narration: "At Think Design Collaborative, I spent over 8 years growing from Interaction Designer to Deputy Design Head. I managed customer success for major clients including the Indian Navy, GE, Honeywell, Tata Group, and Oppo, achieving studio revenue of 15 million rupees in just 10 months."
    },
    {
        id: 10,
        row: 3,
        col: 1,
        title: "Tata ClassEdge",
        subtitle: "EdTech Transformation",
        description: "Led the Service Design transformation impacting 40,000+ Indian schools. Prototyped MVP that raised $10M in seed funding.",
        theme: "dark",
        narration: "One of my most impactful projects was Tata ClassEdge, where I led the Service Design transformation impacting over 40,000 Indian schools. The MVP I prototyped raised 10 million dollars in seed funding."
    },
    {
        id: 11,
        row: 3,
        col: 2,
        title: "Oppo Research",
        subtitle: "Ethnographic Insights",
        description: "Used ethnographic research to save the company significant capital by advising against an unviable product launch.",
        theme: "light",
        narration: "At Oppo, I conducted ethnographic research that led to a crucial business decision. My insights saved the company significant capital by advising against an unviable product launch, demonstrating the strategic value of user research."
    },
    {
        id: 12,
        row: 4,
        col: 0,
        title: "Recognition",
        subtitle: "Awards",
        description: "Multiple 'Employee of the Quarter' awards (FY2012, FY2014). Led remote agile teams for flagship product redesigns.",
        theme: "dark",
        narration: "My work was recognized with multiple Employee of the Quarter awards in fiscal years 2012 and 2014. I led remote agile teams for flagship product redesigns and created unified design systems."
    },
    {
        id: 13,
        row: 4,
        col: 1,
        title: "Impact",
        subtitle: "Results",
        description: "Social ecommerce platform acquired within 8 months. EdTech research deployed to 40k schools nationwide.",
        theme: "green",
        narration: "The impact was substantial: a social ecommerce platform I worked on was acquired within 8 months, and our EdTech research was deployed to 40,000 schools across India."
    },

    // ==========================================
    // ROW 5-6: CURRENT & TEACHING
    // ==========================================
    {
        id: 14,
        row: 5,
        col: 0,
        title: "Made Humane",
        subtitle: "Principal Product Strategist",
        description: "Leading market research for an AI text editor startup. Directed MVP proof-of-concept that soft-launched within 12 weeks.",
        theme: "accent",
        subsection: "Made Humane",
        narration: "Currently, I'm Principal Product Strategist at Made Humane, where I lead market research for an AI text editor startup. My insights directed the market positioning, branding, and product design of an MVP that soft-launched within just 12 weeks."
    },
    {
        id: 15,
        row: 5,
        col: 1,
        title: "NID Faculty",
        subtitle: "Visiting Faculty",
        description: "Designing pedagogy for Service Design & Venture Design coursework for undergraduate Industrial and Textile Design students.",
        theme: "dark",
        narration: "I also serve as Visiting Faculty at the National Institute of Design, where I design pedagogy and conduct coursework in Service Design and Venture Design for undergraduate Industrial and Textile Design students."
    },
    {
        id: 16,
        row: 5,
        col: 2,
        title: "Teaching Focus",
        subtitle: "Applied Skills",
        description: "Bridging academia and industry by teaching applied Service Design and Venture Design skills to the next generation of designers.",
        theme: "light",
        narration: "My teaching focuses on bridging academia and industry, ensuring students learn applied Service Design and Venture Design skills that directly translate to real-world practice."
    },
    {
        id: 17,
        row: 6,
        col: 0,
        title: "Sectors",
        subtitle: "Industry Experience",
        description: "Enterprise SaaS, EdTech, FinTech, Travel, AI & Spatial Computing. From stealth startups to Fortune 500 companies.",
        theme: "dark",
        narration: "My experience spans multiple sectors: Enterprise SaaS, EdTech, FinTech, Travel, AI and Spatial Computing. I've worked with everyone from stealth startups to Fortune 500 companies."
    },
    {
        id: 18,
        row: 6,
        col: 1,
        title: "Core Skills",
        subtitle: "Expertise",
        description: "Strategic Research • Ethnography • Journey Mapping • Service Blueprints • Business Design • Rapid Prototyping",
        theme: "green",
        narration: "My core skills include Strategic Research, Ethnography, Journey Mapping, Service Blueprints, Business Design, and Rapid Prototyping — a complete toolkit for transforming insights into impactful products."
    },

    // ==========================================
    // ROW 7: CREDENTIALS & CONTACT
    // ==========================================
    {
        id: 19,
        row: 7,
        col: 0,
        title: "Credentials",
        subtitle: "Education & Certifications",
        description: "B.Tech Computer Science (Anna University) • MIT Design Thinking • Stanford Technology Entrepreneurship • CIID Service Design • d.MBA Business Design",
        theme: "dark",
        section: "Credentials",
        narration: "My credentials include a Bachelor's in Computer Science from Anna University, MIT's Design Thinking program, Stanford's Technology Entrepreneurship certification, CIID's Service Design course, and d.MBA's Business Design certification."
    },
    {
        id: 20,
        row: 7,
        col: 1,
        title: "Let's Connect",
        subtitle: "Get in Touch",
        description: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
        link: { text: "linkedin.com/in/philosafi", url: "https://www.linkedin.com/in/philosafi/" },
        theme: "accent",
        section: "Contact",
        narration: "Thank you for exploring my portfolio. I'm always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Connect with me on LinkedIn at philosafi. I'd love to hear from you."
    }
];

// Navigation sections for sidebar
const navSections = [
    { id: 'home', label: 'Home', slideId: 1 },
    { id: 'about', label: 'Who Am I', slideId: 2 },
    {
        id: 'work',
        label: 'Work',
        children: [
            { id: 'microsoft', label: 'Microsoft', slideId: 4 },
            { id: 'thinkdesign', label: 'Think Design', slideId: 9 },
            { id: 'madehumane', label: 'Made Humane', slideId: 14 }
        ]
    },
    { id: 'credentials', label: 'Credentials', slideId: 19 },
    { id: 'contact', label: 'Contact', slideId: 20 }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { slidesData, navSections };
}
