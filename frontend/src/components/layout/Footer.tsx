import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-brand-foreground font-bold">
              TG
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-brand">{site.name}</div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                Microsoft Licensing
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Nhà phân phối license phần mềm Microsoft chính hãng cho doanh nghiệp và cá nhân tại Việt Nam.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Microsoft Authorized Reseller
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Sản phẩm</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">Windows 11 / 10</Link></li>
            <li><Link to="/products" className="hover:text-primary">Microsoft Office</Link></li>
            <li><Link to="/products" className="hover:text-primary">Microsoft 365</Link></li>
            <li><Link to="/products" className="hover:text-primary">Windows Server</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Hỗ trợ</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/faq" className="hover:text-primary">Câu hỏi thường gặp</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Liên hệ</Link></li>
            <li><Link to="/about" className="hover:text-primary">Về chúng tôi</Link></li>
            <li><span>Chính sách bảo hành</span></li>
            <li><span>Chính sách bảo mật</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Liên hệ</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {site.address}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {site.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> {site.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} {site.name}. Mọi quyền được bảo lưu.</div>
          <div className="flex items-center gap-3">
            <span>Thanh toán:</span>
            <span className="px-2 py-1 rounded border border-border bg-background">VISA</span>
            <span className="px-2 py-1 rounded border border-border bg-background">Mastercard</span>
            <span className="px-2 py-1 rounded border border-border bg-background">VNPay</span>
            <span className="px-2 py-1 rounded border border-border bg-background">Bank</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
