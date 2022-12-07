export async function tryTimes(
  message: string,
  n: number,
  delayTime: number,
  f: () => Promise<boolean>
): Promise<boolean> {
  if (n <= 0) {
    return Promise.reject("Fail");
  } else {
    const a = f()
      .then((success) => (success ? true : retry(message, n, delayTime, f)))
      .catch((e) => retry(message, n, delayTime, f, e));
    return a;
  }
}

async function retry(
  message: string,
  n: number,
  delayTime: number,
  f: () => Promise<boolean>,
  e?: any
) {
  console.error(e);
  console.error(`'${message}' retrying... (${n - 1} times left)`);
  await delay(delayTime);
  return tryTimes(message, n - 1, delayTime, f);
}

function delay(n: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, n);
  });
}
