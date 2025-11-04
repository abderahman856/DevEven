'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { IEvent } from "@/database"; // Make sure you have this interface exported

export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
  try {
    await connectDB();

    // Find the single event first
    const event = await Event.findOne({ slug }).lean<IEvent | null>();
    if (!event) return [];

    // Then find similar ones
    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean<IEvent[]>();

    return similarEvents;
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
