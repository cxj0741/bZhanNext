import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RecordRequest {
    userId: string;
    topicId: string;
    choice?: string;
}

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { userId, topicId, choice } = (await request.json()) as RecordRequest;

        if (!userId || !topicId || !choice) {
            return NextResponse.json({ message: "Bad Request" }, { status: 400 });
        }

        let record;

        // 开启事务
        await prisma.$transaction(async (tx) => {
            const oldRecord = await tx.record.findFirst({
                where: {
                    topicId: topicId,
                    userId: userId,
                },
            });

            if (oldRecord) {
                const topic = await tx.topic.findUnique({
                    where: {
                        id: topicId,
                    },
                    include: {
                        options: true,
                    },
                });

                if (!topic) {
                    throw new Error("Topic not found");
                }

                const selectedOption = topic.options.find((option) => option.key === oldRecord.choice);
                
                if (selectedOption) {
                    await tx.option.update({
                        where: {
                            id: selectedOption.id,
                        },
                        data: {
                            value: selectedOption.value - 1,
                        },
                    });

                    await tx.record.delete({
                        where: {
                            id: oldRecord.id,
                        },
                    });
                }
            }

            const topic = await tx.topic.findUnique({
                where: {
                    id: topicId,
                },
                include: {
                    options: true,
                },
            });

            if (!topic) {
                throw new Error("Topic not found");
            }

            const selectedOption = topic.options.find((option) => option.key === choice);

            if (selectedOption) {
                await tx.option.update({
                    where: {
                        id: selectedOption.id,
                    },
                    data: {
                        value: selectedOption.value + 1,
                    },
                });

                record = await tx.record.create({
                    data: {
                        userId,
                        topicId,
                        choice,
                    },
                });
            } else {
                throw new Error("Selected option not found");
            }
        });

        // 在事务外面进行返回
        return NextResponse.json({ record }, { status: 200 });
    } catch (e) {
        console.error("获取投票数据失败：", e);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: NextRequest){
    const {searchParams} = new URL(request.url);
    const record= await prisma.record.findFirst({
        where: {
            userId: searchParams.get("userId") ?? "",
            topicId: searchParams.get("topicId") ?? ""
        }
    });

    if(!record){
        return NextResponse.json({
            message: "Can't find record"
        },{status: 400});
    }

    return NextResponse.json({
        record
    },{status: 200})
}
