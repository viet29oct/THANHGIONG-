import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Câu hỏi thường gặp — Thánh Gióng" },
      { name: "description", content: "Giải đáp các câu hỏi thường gặp về mua license Microsoft chính hãng tại Máy tính Thánh Gióng." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div>
      <section className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <nav className="text-xs text-muted-foreground">Trang chủ / <span className="text-foreground">FAQ</span></nav>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold">Câu hỏi thường gặp</h1>
          <p className="mt-3 text-muted-foreground">
            Các thắc mắc phổ biến của khách hàng khi mua và sử dụng license Microsoft.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <Accordion type="single" collapsible className="divide-y divide-border border border-border rounded-lg bg-background">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-0 px-5">
              <AccordionTrigger className="text-left font-semibold text-[15px]">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
