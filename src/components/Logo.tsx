import valarLogo from "../assets/valar.svg";

export function Logo({ className = "h-5 lg:h-6" }: { className?: string }) {
  return <img src={valarLogo} alt="Valar" className={className} />;
}
