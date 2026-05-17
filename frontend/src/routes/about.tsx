import { createFileRoute } from "@tanstack/react-router";
import { Award, Users, Building2, Target } from "lucide-react";
import { site } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Giới thiệu — Máy tính Thánh Gióng" },
      { name: "description", content: "Máy tính Thánh Gióng — nhà phân phối license Microsoft chính hãng với hơn 10 năm kinh nghiệm phục vụ doanh nghiệp Việt Nam." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <nav className="text-xs text-muted-foreground">Trang chủ / <span className="text-foreground">Giới thiệu</span></nav>
          <h1 className="mt-4 text-4xl font-bold leading-tight">Về {site.name}</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Với hơn 10 năm hoạt động trong lĩnh vực phân phối phần mềm bản quyền, chúng tôi tự hào là đối tác tin cậy của hơn 12,500 doanh nghiệp trên toàn quốc trong việc triển khai giải pháp license Microsoft.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">Sứ mệnh</div>
          <h2 className="mt-2 text-2xl font-bold">Đồng hành cùng doanh nghiệp Việt</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Chúng tôi giúp doanh nghiệp tiếp cận phần mềm Microsoft chính hãng với chi phí tối ưu, quy trình mua sắm minh bạch và hỗ trợ kỹ thuật chuyên sâu — đảm bảo môi trường công nghệ an toàn, ổn định và tuân thủ pháp lý.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-primary font-semibold">Tầm nhìn</div>
          <h2 className="mt-2 text-2xl font-bold">Đối tác phân phối hàng đầu</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Trở thành nhà phân phối license Microsoft hàng đầu tại Việt Nam, được tin tưởng bởi sự chuyên nghiệp, chính trực và năng lực hỗ trợ kỹ thuật toàn diện cho khách hàng doanh nghiệp.
          </p>
        </div>
      </section>

      <section className="bg-surface border-y border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold">Giá trị cốt lõi</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Award, t: "Chính trực", d: "Cam kết 100% license chính hãng, minh bạch xuất xứ." },
              { icon: Users, t: "Khách hàng", d: "Đặt lợi ích và trải nghiệm khách hàng làm trọng tâm." },
              { icon: Target, t: "Chuyên nghiệp", d: "Quy trình chuẩn hóa, đội ngũ kỹ thuật chứng chỉ Microsoft." },
              { icon: Building2, t: "Bền vững", d: "Xây dựng quan hệ đối tác dài hạn cùng doanh nghiệp." },
            ].map((v) => (
              <div key={v.t} className="rounded-lg border border-border bg-background p-6">
                <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{v.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-2xl font-bold">Thông tin doanh nghiệp</h2>
        <dl className="mt-6 divide-y divide-border border border-border rounded-lg bg-background">
          {[
            ["Tên công ty", site.name],
            ["Địa chỉ", site.address],
            ["Điện thoại", site.phone],
            ["Email", site.email],
            ["Giờ làm việc", site.hours],
          ].map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-[200px_1fr] p-4 text-sm">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
