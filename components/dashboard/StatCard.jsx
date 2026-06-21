export default function StatCard({ icon, label, value, color = 'primary' }) {
  const colors = {
    primary: 'from-primary to-primary/50',
    accent: 'from-accent to-accent/50',
    cyan: 'from-cyan-400 to-cyan-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-green-400 to-green-600',
    orange: 'from-orange-400 to-orange-600',
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-neutral/60 text-sm font-medium">{label}</p>
          <p className="text-2xl font-black text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}