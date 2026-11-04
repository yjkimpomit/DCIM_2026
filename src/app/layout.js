export const metadata = {
  title: "DCIM - 포미트",
  description: "DCIM - 포미트",
  icons: { icon: "images/favicon_twinplant.ico" },
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
