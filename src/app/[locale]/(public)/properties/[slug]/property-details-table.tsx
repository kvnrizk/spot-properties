interface PropertyDetailsTableProps {
  type: string;
  status: string;
  landArea: number | null;
  floor: number | null;
  parkingSpaces: number | null;
  rooms: number | null;
  translations: {
    title: string;
    type: string;
    status: string;
    landArea: string;
    floor: string;
    parking: string;
    spaces: string;
    rooms: string;
  };
}

export function PropertyDetailsTable({
  type,
  status,
  landArea,
  floor,
  parkingSpaces,
  rooms,
  translations,
}: PropertyDetailsTableProps) {
  const statusDisplay = status.replace("_", " ");
  const typeDisplay = type.replace("_", " ");

  return (
    <div className="bg-white rounded-lg border-2 border-spot-dark/20 p-6">
      <h2 className="text-2xl font-bold text-spot-dark mb-4">{translations.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailRow label={translations.type} value={typeDisplay} />
        <DetailRow label={translations.status} value={statusDisplay} />
        {landArea && <DetailRow label={translations.landArea} value={`${landArea} m²`} />}
        {floor !== null && <DetailRow label={translations.floor} value={floor.toString()} />}
        {parkingSpaces !== null && (
          <DetailRow
            label={translations.parking}
            value={`${parkingSpaces} ${translations.spaces}`}
          />
        )}
        {rooms !== null && <DetailRow label={translations.rooms} value={rooms.toString()} />}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-spot-dark/10">
      <span className="text-spot-dark/70 font-medium">{label}</span>
      <span className="text-spot-dark font-semibold">{value}</span>
    </div>
  );
}
