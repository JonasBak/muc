import { Result } from "utils/req";

function ErrorHandlerWrapper<T, P>({
  wrappedProps,
  Component,
  mapSuccessToProps,
  ErrorComponent
}: {
  wrappedProps: Result<T>;
  Component: any;
  mapSuccessToProps: (data: T) => P;
  ErrorComponent: any;
}) {
  if (wrappedProps.type === "ERROR") {
    return <ErrorComponent />;
  }
  return <Component {...mapSuccessToProps(wrappedProps.data)} />;
}

export default ErrorHandlerWrapper;
