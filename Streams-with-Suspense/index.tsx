import { renderToStream, Suspense } from "@kitajs/html/suspense";
import { Readable } from "node:stream";

/*
 * Here kitajs/html provides a Suspense component that we can use to produce stream
 * with `renderToStream` func
 *
 * Note the difference between Readable (Coming from nodejs) and ReadableStream (which is a web standard).
 * We can convert one to each other by using `Readable.toWeb()` or `Readble.fromWeb()`
 *
 * Suspense can delay any costly components sending first the fallback, then it send the data.
 */

Bun.serve({
  port: 3001,
  fetch: () => {
    const stream = renderToStream((r) => <App rid={r} />);

    const webStream = Readable.toWeb(stream);

    return new Response(webStream, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  },
});

const SlowComponent = async () => {
  await new Promise((res) => setTimeout(res, 5000));
  return <div>Resolved !</div>;
};

const App = ({ rid }: { rid: string | number }) => {
  return (
    <div>
      This is the shell
      <Suspense rid={rid} fallback={<div>Waiting !</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
};
