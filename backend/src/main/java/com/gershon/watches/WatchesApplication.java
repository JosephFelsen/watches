package com.gershon.watches;

import com.gershon.watches.model.Watch;
import com.gershon.watches.repository.WatchRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class WatchesApplication {

    public static void main(String[] args) {
        SpringApplication.run(WatchesApplication.class, args);
    }

    // Seed database with initial luxury watches
    @Bean
    public CommandLineRunner initDatabase(WatchRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Watch(
                    "Gershon Royal Chronograph Rose Gold",
                    "Gershon Genève",
                    new BigDecimal("34500.00"),
                    "/images/watch1.png",
                    "Handcrafted 18k rose gold chronograph featuring obsidian guilloché dial, self-winding mechanical movement with 72-hour power reserve."
                ));

                repository.save(new Watch(
                    "Grand Tourbillon Skeleton Edition",
                    "Gershon Atelier",
                    new BigDecimal("89000.00"),
                    "/images/watch2.png",
                    "High complication skeletonized tourbillon encased in polished 950 platinum with anti-reflective sapphire glass crystal."
                ));

                // Watch with NULL price (Price on Request / Concierge Acquisition!)
                repository.save(new Watch(
                    "Nautilus Vintage Golden Sunburst",
                    "Gershon Heritage",
                    null, // Null price!
                    "/images/watch3.png",
                    "Ultra-rare vintage golden dress timepiece featuring deep cobalt blue sunburst dial and yellow gold integrated bezel. Private acquisition only."
                ));
            }
        };
    }
}
