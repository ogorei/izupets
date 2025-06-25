export default function NotFound({ locale }: { locale: string }) {
  return (
    <div className="text-center p-8">
      {locale === 'ja' ? (
        <h1 className="text-2xl">ページが見つかりませんでした</h1>
      ) : (
        <h1 className="text-2xl">Page Not Found</h1>
      )}
      {/* You can customize further here */}
    </div>
  );
}
