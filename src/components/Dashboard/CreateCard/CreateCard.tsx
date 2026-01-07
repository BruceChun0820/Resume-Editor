import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CreateCardProps {
    onClick: () => void;
}

export function CreateCard({ onClick }: CreateCardProps) {
    return (
        <Card
            onClick={onClick}
            className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300
             transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px] group shadow-none"
        >
            <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus size={28} className="text-slate-400 group-hover:text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-600">新建简历</h3>
            <p className="text-xs text-slate-400 mt-1">从空白开始</p>
        </Card>
    );
}