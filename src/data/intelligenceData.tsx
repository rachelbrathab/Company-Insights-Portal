import {
  Briefcase,
  Building2,
  Users,
  DollarSign,
  Globe2,
  Package,
  Cpu,
  Handshake,
  Swords,
  Target,
  HeartHandshake,
  Sparkles,
  Newspaper,
  LineChart,
  ShieldAlert,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Award,
  Wallet,
  Star,
  Phone,
} from "lucide-react";
import type { ComponentType } from "react";
import type { CompanyProfile } from "@/lib/companyData";

export type FieldType = "text" | "url" | "video" | "rating" | "list" | "paragraph" | "auto";
export type Field = { key: string; label: string; type?: FieldType };
export type Section = {
  id: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  fields: Field[];
};

const S = (id: string, title: string, icon: any, fields: Field[]): Section => ({ id, title, icon, fields });

export function buildIntelligenceSections(profile?: CompanyProfile | null): Section[] {
  const p = profile || ({} as CompanyProfile);
  const sections: Section[] = [
    S("identity", "Company Identity", Briefcase, [
      { key: "name", label: "Legal Name" },
      { key: "short_name", label: "Short Name" },
      { key: "category", label: "Category" },
      { key: "nature_of_company", label: "Nature" },
      { key: "incorporation_year", label: "Incorporated" },
    ]),
    S("overview", "Overview & Vision", Building2, [
      { key: "overview_text", label: "Overview", type: "paragraph" },
      { key: "vision_statement", label: "Vision", type: "paragraph" },
      { key: "mission_statement", label: "Mission", type: "paragraph" },
      { key: "core_values", label: "Core Values", type: "list" },
      { key: "history_timeline", label: "History", type: "list" },
    ]),
    S("leadership", "Leadership", Users, [
      { key: "ceo_name", label: "CEO" },
      { key: "ceo_linkedin_url", label: "CEO LinkedIn", type: "url" },
      { key: "key_leaders", label: "Key Leaders", type: "list" },
      { key: "board_members", label: "Board", type: "list" },
      { key: "warm_intro_pathways", label: "Warm Intro Paths", type: "list" },
    ]),
    S("funding", "Funding & Financials", DollarSign, [
      { key: "annual_revenue", label: "Revenue" },
      { key: "annual_profit", label: "Profit" },
      { key: "revenue_mix", label: "Revenue Mix" },
      { key: "valuation", label: "Valuation" },
      { key: "yoy_growth_rate", label: "YoY Growth" },
      { key: "profitability_status", label: "Profitability" },
      { key: "key_investors", label: "Key Investors", type: "list" },
      { key: "recent_funding_rounds", label: "Recent Funding" },
      { key: "total_capital_raised", label: "Capital Raised" },
    ]),
    S("global", "Global Presence", Globe2, [
      { key: "headquarters_address", label: "Headquarters" },
      { key: "operating_countries", label: "Countries", type: "list" },
      { key: "office_count", label: "Office Count" },
      { key: "office_locations", label: "Office Locations", type: "list" },
      { key: "employee_size", label: "Employees" },
    ]),
    S("products", "Products & Services", Package, [
      { key: "offerings_description", label: "Offerings", type: "list" },
      { key: "focus_sectors", label: "Focus Sectors", type: "list" },
      { key: "pain_points_addressed", label: "Pain Points Solved", type: "list" },
      { key: "top_customers", label: "Top Customers", type: "list" },
      { key: "case_studies", label: "Case Studies", type: "list" },
      { key: "product_pipeline", label: "Product Pipeline", type: "list" },
    ]),
    S("tech", "Technology Stack", Cpu, [
      { key: "tech_stack", label: "Tech Stack", type: "list" },
      { key: "ai_ml_adoption_level", label: "AI/ML Adoption" },
      { key: "r_and_d_investment", label: "R&D Investment" },
      { key: "intellectual_property", label: "IP", type: "list" },
      { key: "cybersecurity_posture", label: "Cybersecurity", type: "list" },
      { key: "tech_adoption_rating", label: "Tech Adoption" },
    ]),
    S("partners", "Partnerships & Ecosystem", Handshake, [
      { key: "technology_partners", label: "Tech Partners", type: "list" },
      { key: "partnership_ecosystem", label: "Ecosystem", type: "list" },
      { key: "industry_associations", label: "Associations", type: "list" },
    ]),
    S("competitive", "Competitive Landscape", Swords, [
      { key: "key_competitors", label: "Competitors", type: "list" },
      { key: "market_share_percentage", label: "Market Share" },
      { key: "benchmark_vs_peers", label: "Benchmark vs Peers" },
      { key: "competitive_advantages", label: "Advantages", type: "list" },
      { key: "weaknesses_gaps", label: "Weaknesses", type: "list" },
    ]),
    S("market", "Market Opportunity", Target, [
      { key: "tam", label: "TAM" },
      { key: "sam", label: "SAM" },
      { key: "som", label: "SOM" },
      { key: "future_projections", label: "Projections" },
      { key: "strategic_priorities", label: "Strategic Priorities", type: "list" },
      { key: "go_to_market_strategy", label: "GTM Strategy", type: "list" },
      { key: "innovation_roadmap", label: "Innovation Roadmap", type: "list" },
    ]),
    S("value", "Core Value Proposition & ESG", HeartHandshake, [
      { key: "core_value_proposition", label: "Value Prop", type: "list" },
      { key: "unique_differentiators", label: "Differentiators", type: "list" },
      { key: "esg_ratings", label: "ESG", type: "list" },
      { key: "carbon_footprint", label: "Carbon Footprint" },
      { key: "ethical_sourcing", label: "Ethical Sourcing", type: "list" },
      { key: "sustainability_csr", label: "Sustainability/CSR" },
    ]),
    S("culture", "Culture & Work Life", Sparkles, [
      { key: "work_culture_summary", label: "Culture" },
      { key: "manager_quality", label: "Manager Quality" },
      { key: "psychological_safety", label: "Psych. Safety" },
      { key: "feedback_culture", label: "Feedback Culture" },
      { key: "diversity_inclusion_score", label: "DEI" },
      { key: "ethical_standards", label: "Ethics" },
      { key: "burnout_risk", label: "Burnout Risk" },
      { key: "layoff_history", label: "Layoff History" },
      { key: "mission_clarity", label: "Mission Clarity" },
      { key: "crisis_behavior", label: "Crisis Behavior" },
    ]),
    S("news", "Recent News & Milestones", Newspaper, [
      { key: "recent_news", label: "Recent News", type: "list" },
      { key: "awards_recognitions", label: "Awards", type: "list" },
      { key: "event_participation", label: "Events", type: "list" },
    ]),
    S("sales", "Sales & Customer Metrics", LineChart, [
      { key: "sales_motion", label: "Sales Motion" },
      { key: "customer_concentration_risk", label: "Customer Concentration" },
      { key: "net_promoter_score", label: "NPS" },
      { key: "customer_testimonials", label: "Testimonials", type: "list" },
      { key: "exit_strategy_history", label: "Exit History" },
    ]),
    S("risk", "Risk & Compliance", ShieldAlert, [
      { key: "regulatory_status", label: "Regulatory", type: "list" },
      { key: "legal_issues", label: "Legal Issues" },
      { key: "supply_chain_dependencies", label: "Supply Chain", type: "list" },
      { key: "geopolitical_risks", label: "Geopolitical Risks", type: "list" },
      { key: "macro_risks", label: "Macro Risks", type: "list" },
    ]),
    S("location", "Work Location & Commute", MapPin, [
      { key: "remote_policy_details", label: "Remote Policy" },
      { key: "typical_hours", label: "Hours" },
      { key: "overtime_expectations", label: "Overtime" },
      { key: "weekend_work", label: "Weekend Work" },
      { key: "flexibility_level", label: "Flexibility", type: "list" },
      { key: "location_centrality", label: "Centrality" },
      { key: "public_transport_access", label: "Transport", type: "list" },
      { key: "cab_policy", label: "Cab Policy" },
      { key: "airport_commute_time", label: "Airport Commute" },
      { key: "office_zone_type", label: "Zone Type" },
    ]),
    S("safety", "Safety & Wellbeing", ShieldCheck, [
      { key: "area_safety", label: "Area Safety" },
      { key: "safety_policies", label: "Safety Policies", type: "list" },
      { key: "infrastructure_safety", label: "Infrastructure" },
      { key: "emergency_preparedness", label: "Emergency Readiness" },
      { key: "health_support", label: "Health Support" },
    ]),
    S("growth", "Career Growth & Learning", TrendingUp, [
      { key: "training_spend", label: "Training Spend" },
      { key: "onboarding_quality", label: "Onboarding" },
      { key: "learning_culture", label: "Learning Culture", type: "list" },
      { key: "mentorship_availability", label: "Mentorship" },
      { key: "internal_mobility", label: "Internal Mobility" },
      { key: "promotion_clarity", label: "Promotion Clarity" },
      { key: "role_clarity", label: "Role Clarity" },
      { key: "early_ownership", label: "Early Ownership" },
      { key: "work_impact", label: "Work Impact" },
      { key: "cross_functional_exposure", label: "Cross-Functional", type: "list" },
      { key: "exit_opportunities", label: "Exit Opportunities", type: "list" },
      { key: "skill_relevance", label: "Skill Relevance" },
      { key: "network_strength", label: "Network" },
      { key: "global_exposure", label: "Global Exposure" },
    ]),
    S("brand", "Brand & Reputation", Award, [
      { key: "brand_value", label: "Brand Value" },
      { key: "brand_sentiment_score", label: "Sentiment" },
      { key: "external_recognition", label: "Recognition" },
      { key: "company_maturity", label: "Maturity" },
      { key: "client_quality", label: "Client Quality" },
    ]),
    S("comp", "Compensation & Benefits", Wallet, [
      { key: "leave_policy", label: "Leave Policy", type: "list" },
      { key: "esops_incentives", label: "Equity/Incentives", type: "list" },
      { key: "family_health_insurance", label: "Family Health" },
      { key: "relocation_support", label: "Relocation", type: "list" },
      { key: "lifestyle_benefits", label: "Lifestyle", type: "list" },
      { key: "hiring_velocity", label: "Hiring Velocity", type: "list" },
      { key: "employee_turnover", label: "Turnover" },
      { key: "avg_retention_tenure", label: "Avg Tenure" },
      { key: "diversity_metrics", label: "Diversity", type: "list" },
    ]),
    S("digital", "Digital Presence & Ratings", Star, [
      { key: "website_url", label: "Website", type: "url" },
      { key: "linkedin_url", label: "LinkedIn", type: "url" },
      { key: "twitter_handle", label: "Twitter" },
      { key: "facebook_url", label: "Facebook", type: "url" },
      { key: "instagram_url", label: "Instagram", type: "url" },
      { key: "marketing_video_url", label: "Marketing Video", type: "video" },
      { key: "website_quality", label: "Website Quality" },
      { key: "website_traffic_rank", label: "Traffic Rank" },
      { key: "social_media_followers", label: "Followers" },
      { key: "glassdoor_rating", label: "Glassdoor", type: "rating" },
      { key: "indeed_rating", label: "Indeed", type: "rating" },
      { key: "google_rating", label: "Google", type: "rating" },
    ]),
    S("contact", "Contact Information", Phone, [
      { key: "primary_contact_email", label: "Email" },
      { key: "primary_phone_number", label: "Phone" },
      { key: "contact_person_name", label: "Contact" },
      { key: "contact_person_title", label: "Title" },
      { key: "contact_person_email", label: "Contact Email" },
      { key: "contact_person_phone", label: "Contact Phone" },
    ]),
  ];

  if (profile) {
    return sections.map((sec) => ({
      ...sec,
      fields: sec.fields.map((f) => ({ ...f })),
    }));
  }
  return sections;
}
