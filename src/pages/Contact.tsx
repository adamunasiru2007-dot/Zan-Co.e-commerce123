import { Layout } from "@/components/layout/Layout";
import { Phone, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="container max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              We'd love to hear from you. Reach out anytime!
            </p>
          </div>

          <div className="grid gap-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            {/* Phone */}
            <a 
              href="tel:08144853538"
              className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                <p className="text-xl font-semibold">08144853538</p>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Call Now
              </Button>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/ewelahh1"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Instagram className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Instagram</p>
                <p className="text-xl font-semibold">@ewelahh1</p>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Follow
              </Button>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/2348144853538"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex items-center gap-4 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#25D366]/10 group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="h-6 w-6 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                <p className="text-xl font-semibold">08144853538</p>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-[#25D366]">
                Chat Now
              </Button>
            </a>
          </div>

          <div className="text-center mt-12 text-muted-foreground animate-fade-in" style={{ animationDelay: "200ms" }}>
            <p>We typically respond within 24 hours</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
