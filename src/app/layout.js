export const metadata = {
  title: "포미트 - DCIM 시스템",
  description: "액침냉각 시스템",
  icons: { icon: "/images/favicon.ico" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({ children }) {
  return (
   <html lang="ko"> 
      <head>
        <link href="/css/layout.css" rel="stylesheet"/>
        <link href="/css/modal.css" rel="stylesheet"/>

      </head>
      <body className="page">
        {children}
      </body>
    </html>
  );
}
