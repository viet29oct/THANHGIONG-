export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Windows" | "Office" | "Windows Server";
  licenseType: string;
  price: number;
  originalPrice?: number;
  image: string;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  inStock: boolean;
  featured?: boolean;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=80`;

export const products: Product[] = [
  {
    id: "win11pro",
    slug: "windows-11-pro",
    name: "Microsoft Windows 11 Pro",
    category: "Windows",
    licenseType: "Retail – Vĩnh viễn",
    price: 2890000,
    originalPrice: 3590000,
    image: img("photo-1633419461186-7d40a38105ec"),
    shortDescription:
      "Hệ điều hành Windows 11 Pro bản quyền vĩnh viễn dành cho doanh nghiệp và cá nhân.",
    description:
      "Windows 11 Pro mang đến trải nghiệm làm việc hiện đại với BitLocker, Hyper-V, Remote Desktop và quản trị doanh nghiệp qua Active Directory. License kích hoạt trực tiếp qua tài khoản Microsoft.",
    specs: [
      { label: "Loại license", value: "Retail / Vĩnh viễn" },
      { label: "Số thiết bị", value: "1 PC" },
      { label: "Ngôn ngữ", value: "Đa ngôn ngữ" },
      { label: "Giao hàng", value: "Ngay sau thanh toán" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "win10pro",
    slug: "windows-10-pro",
    name: "Microsoft Windows 10 Pro",
    category: "Windows",
    licenseType: "Retail – Vĩnh viễn",
    price: 2390000,
    originalPrice: 2990000,
    image: img("photo-1629654297299-c8506221ca97"),
    shortDescription:
      "Windows 10 Pro bản quyền – ổn định, tương thích phần mềm doanh nghiệp.",
    description:
      "Windows 10 Pro là lựa chọn tin cậy cho hệ thống doanh nghiệp, hỗ trợ đầy đủ BitLocker, Group Policy và Remote Desktop.",
    specs: [
      { label: "Loại license", value: "Retail / Vĩnh viễn" },
      { label: "Số thiết bị", value: "1 PC" },
      { label: "Hỗ trợ", value: "Trọn đời license" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "office2021",
    slug: "office-2021-pro-plus",
    name: "Microsoft Office 2021 Pro Plus",
    category: "Office",
    licenseType: "Vĩnh viễn",
    price: 1890000,
    originalPrice: 2490000,
    image: img("photo-1611224885990-ab7363d7f2a9"),
    shortDescription:
      "Bộ ứng dụng văn phòng Office 2021 Pro Plus bản quyền vĩnh viễn.",
    description:
      "Office 2021 Pro Plus gồm Word, Excel, PowerPoint, Outlook, Access, Publisher. Kích hoạt vĩnh viễn cho 1 thiết bị, nhận cập nhật bảo mật trọn đời.",
    specs: [
      { label: "Ứng dụng", value: "Word, Excel, PowerPoint, Outlook, Access" },
      { label: "Số thiết bị", value: "1 PC" },
      { label: "Loại", value: "Bind / Vĩnh viễn" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "office365",
    slug: "microsoft-365-business",
    name: "Microsoft 365 Business Standard",
    category: "Office",
    licenseType: "Subscription 1 năm",
    price: 1490000,
    image: img("photo-1633419461186-7d40a38105ec"),
    shortDescription:
      "Microsoft 365 Business Standard – Office + 1TB OneDrive cho mỗi người dùng.",
    description:
      "Gói Microsoft 365 Business Standard dành cho doanh nghiệp: Office trên 5 thiết bị/người, Exchange Email, Teams, SharePoint và 1TB OneDrive.",
    specs: [
      { label: "Thời hạn", value: "12 tháng" },
      { label: "Số thiết bị", value: "5 PC + 5 Mobile / user" },
      { label: "Dung lượng", value: "1TB OneDrive" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "winserver2022",
    slug: "windows-server-2022-standard",
    name: "Windows Server 2022 Standard",
    category: "Windows Server",
    licenseType: "OEM – Vĩnh viễn",
    price: 18900000,
    image: img("photo-1558494949-ef010cbdcc31"),
    shortDescription:
      "Windows Server 2022 Standard bản quyền cho hạ tầng doanh nghiệp.",
    description:
      "Windows Server 2022 Standard với bảo mật nâng cao, hỗ trợ Hybrid Cloud với Azure Arc, cải tiến hiệu năng và quản trị hệ thống doanh nghiệp.",
    specs: [
      { label: "Loại license", value: "OEM / Vĩnh viễn" },
      { label: "Core", value: "16 core" },
      { label: "CAL", value: "Bán riêng" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "office2019",
    slug: "office-2019-home-business",
    name: "Office 2019 Home & Business",
    category: "Office",
    licenseType: "Vĩnh viễn",
    price: 1490000,
    image: img("photo-1611162617213-7d7a39e9b1d7"),
    shortDescription: "Office 2019 cho gia đình và doanh nghiệp nhỏ.",
    description:
      "Office 2019 Home & Business gồm Word, Excel, PowerPoint, Outlook – bản quyền vĩnh viễn cho 1 thiết bị.",
    specs: [
      { label: "Ứng dụng", value: "Word, Excel, PowerPoint, Outlook" },
      { label: "Số thiết bị", value: "1 PC / Mac" },
    ],
    inStock: true,
  },
  {
    id: "win11home",
    slug: "windows-11-home",
    name: "Windows 11 Home",
    category: "Windows",
    licenseType: "Retail – Vĩnh viễn",
    price: 1990000,
    image: img("photo-1629654297299-c8506221ca97"),
    shortDescription: "Windows 11 Home bản quyền cho người dùng cá nhân.",
    description:
      "Windows 11 Home phù hợp cho người dùng gia đình với giao diện hiện đại, hiệu năng tối ưu.",
    specs: [
      { label: "Loại license", value: "Retail / Vĩnh viễn" },
      { label: "Số thiết bị", value: "1 PC" },
    ],
    inStock: true,
  },
  {
    id: "winserver-cal",
    slug: "windows-server-cal-2022",
    name: "Windows Server CAL 2022 (User)",
    category: "Windows Server",
    licenseType: "CAL – Vĩnh viễn",
    price: 990000,
    image: img("photo-1558494949-ef010cbdcc31"),
    shortDescription: "License truy cập máy chủ (User CAL) cho Windows Server 2022.",
    description:
      "User CAL cấp quyền cho 1 người dùng truy cập Windows Server 2022 từ bất kỳ thiết bị nào.",
    specs: [
      { label: "Loại", value: "User CAL" },
      { label: "Phiên bản", value: "Server 2022" },
    ],
    inStock: true,
  },
];

export const formatVND = (v: number) =>
  v.toLocaleString("vi-VN") + "₫";
