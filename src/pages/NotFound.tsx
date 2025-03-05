
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">الصفحة غير موجودة</p>
        <div className="text-muted-foreground mb-8">
          عذراً، الصفحة التي تبحث عنها غير متوفرة
        </div>
        <Button
          href="/"
          className="inline-flex items-center gap-2 text-primary-foreground"
        >
          <span>العودة للصفحة الرئيسية</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
