import { PreviewLoginForm } from "../_components/PreviewLoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin";

  return (
    <main className="login-shell">
      <section className="login-stage">
        <div className="login-sidecopy">
          <span className="eyebrow">EmpathiQ Preview</span>
          <h2>Protected ecosystem, open surveys.</h2>
          <p>
            Reviewers can sign in to explore admin, parent, mentor, and teen pages.
            The survey forms remain open so families can submit without being pushed
            through the rest of the product.
          </p>
        </div>

        <PreviewLoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}
