import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class CronService implements OnApplicationBootstrap {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly redlock: Redlock,
        private readonly redis: Redis,
    ) {}

    private jobs: CronJob[] = [];

    onApplicationBootstrap() {
        this.jobs.forEach((job) => {
            if (!job.running) {
                job.start();
            }
        });
    }

    schedule(
        cronExpr: string,
        name: string,
        action: (done: () => Promise<void>) => void | Promise<void>,
        time = 5000,
    ) {
        const job = new CronJob(cronExpr, async () => {
            await this.redlock
                .using([`${name}-Lock`], time, async () => {
                    const nextRunDate = await this.redis.get(name);
                    const time = +(nextRunDate || 0);
                    const now = new Date();
                    const secondsSinceEpoch = Math.round(now.getTime() / 1000);

                    if (time < secondsSinceEpoch) {
                        await action(async () => {
                            await this.redis.set(
                                name,
                                job.nextDate().toSeconds(),
                            );
                        });
                    }
                })
                .catch((error) => {
                    this.logger.error(
                        `occured error while executing cron jon (${name}): ${error}`,
                    );
                });
        });

        this.jobs.push(job);

        return job;
    }
}
