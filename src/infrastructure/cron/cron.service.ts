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

    private jobs: Record<string, CronJob> = {};

    onApplicationBootstrap() {
        Object.values(this.jobs)
            .filter((job) => !job.running)
            .forEach((job) => job.start());
    }

    getJob(name: string) {
        return this.jobs[name];
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
                    const maybeTime = await this.redis.get(name);
                    const nextAllowedRunDate = +(maybeTime || 0);

                    if (nextAllowedRunDate < Date.now()) {
                        await action(async () => {
                            await this.redis.set(
                                name,
                                job.nextDate().toMillis(),
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

        this.jobs[name] = job;

        return job;
    }
}
