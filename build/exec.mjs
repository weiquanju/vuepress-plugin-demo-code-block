import { spawn } from 'child_process';

/**
 * 执行shell命令
 * @param {string} command 
 * @returns
 */
export const shell = (command) => new Promise((resolve, reject) => {
  const [name, ...args] = command.split(' ')
  const child = spawn(name, args, { stdio: ['inherit'] })

  // 当子进程退出时
  child.on('exit', function (code, signal) {
    if (code === 0 && signal === null) return resolve()
    console.log('exit', { code, signal });
    resolve()
  });


  child.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`${data}`);
    reject()
  });

});
