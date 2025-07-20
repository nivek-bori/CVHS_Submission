import Navigation from '../components/layout/navbar';
import Map from '../components/maps/map';

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col">
      <Navigation />
      <div className="flex-1">
        <Map />
      </div>
    </div>
  );
}
