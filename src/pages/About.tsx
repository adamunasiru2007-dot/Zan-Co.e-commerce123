import { Layout } from "@/components/layout/Layout";
import { Quote } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="container max-w-4xl">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-16 text-center animate-fade-in">
              <Quote className="h-12 w-12 text-primary mx-auto mb-8 opacity-50" />
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                <span className="text-gradient">More than just a store…</span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light leading-relaxed">
                I believe great products shouldn't be hard to find.
              </p>
              
              <div className="mt-12 pt-8 border-t border-border/50">
                <p className="text-lg text-muted-foreground">
                  Welcome to <span className="text-primary font-semibold">ZAN&CO</span>
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">
                  Your one-stop destination for affordable, quality wears.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;